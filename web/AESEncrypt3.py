#-*- coding: utf-8 -*-
# [[ AESEncrypt3 @ 1.2 ]]
# AES Encrypt/Decrypt Module for Python 3
#
# Encryption with AES-CBC
# Adapted to work with CryptoJS (crypto-js@3.1.9-1) with default configuration
# Compatible with Korean

import hashlib
import os
import struct
import time
from Crypto.Cipher import AES
from Crypto import Random
import binascii
import string
import random
from datetime import date, datetime, timedelta

MODE = AES.MODE_CBC

class PKCS7Encoder():
    class InvalidBlockSizeError(Exception):
        """Raised for invalid block sizes"""
        pass

    def __init__(self, block_size=16):
        if block_size < 2 or block_size > 255:
            raise PKCS7Encoder.InvalidBlockSizeError('The block size must be ' \
                                                     'between 2 and 255, inclusive')
        self.block_size = block_size

    def encode(self, text):
        text_length = len(text.encode('utf-8'))
        amount_to_pad = self.block_size - (text_length % self.block_size)
        if amount_to_pad == 0:
            amount_to_pad = self.block_size
        pad = chr(amount_to_pad)
        return text + pad * amount_to_pad

    def decode(self, text):
        pad = ord(text[-1])
        return text[:-pad]


def evpKDF(passwd, salt, key_size=8, iv_size=4, iterations=1, hash_algorithm="md5"):
    target_key_size = key_size + iv_size
    derived_bytes = b""
    number_of_derived_words = 0
    block = None
    hasher = hashlib.new(hash_algorithm)
    while number_of_derived_words < target_key_size:
        if block is not None:
            hasher.update(block)

        hasher.update(passwd.encode())
        hasher.update(salt)
        block = hasher.digest()
        hasher = hashlib.new(hash_algorithm)

        for i in range(1, iterations):
            hasher.update(block)
            block = hasher.digest()
            hasher = hashlib.new(hash_algorithm)
        derived_bytes += block[0: min(len(block), (target_key_size - number_of_derived_words) * 4)]
        number_of_derived_words += int(len(block)/4)

    return {
        "key": derived_bytes[0: key_size * 4],
        "iv": derived_bytes[key_size * 4:]
    }


def encrypt_file(key, in_filename, out_filename=None, chunksize=65536):
    if not out_filename:
        out_filename = in_filename + '.enc'
    iv = encrypt_key('1Ni7i@LvU*0V2c7#r40r@nKrY&$sE9)t')[:16]
    encryptor = AES.new(key, AES.MODE_CBC, iv)
    filesize = os.path.getsize(in_filename)
    with open(in_filename, 'rb') as infile:
        with open(out_filename, 'wb') as outfile:
            outfile.write(struct.pack('<Q', filesize))
            outfile.write(iv)
            while True:
                chunk = infile.read(chunksize)
                if len(chunk) == 0:
                    break
                elif len(chunk) % 16 != 0:
                    chunk += ' ' * (16 - len(chunk) % 16)
                outfile.write(encryptor.encrypt(chunk))


def decrypt_file(key, in_filename, out_filename, chunksize=24 * 1024):
    with open(in_filename, 'rb') as infile:
        origsize = struct.unpack('<Q', infile.read(struct.calcsize('Q')))[0]
        iv = infile.read(16)
        decryptor = AES.new(key, AES.MODE_CBC, iv)
        with open(out_filename, 'wb') as outfile:
            while True:
                chunk = infile.read(chunksize)
                if len(chunk) == 0:
                    break
                outfile.write(decryptor.decrypt(chunk))
            outfile.truncate(origsize)


def make_salt(salt_len):
    return ''.join(random.sample(string.ascii_letters+string.digits,salt_len))


def encrypt_text(passphrase, plaintext):   # The longer the key, the stronger the encryption
    salt = Random.new().read(8)
    resp = evpKDF(passphrase, salt, key_size=12)
    key = resp.get("key")
    iv = key[len(key)-16:]   # Initialization vector
    key = key[:len(key)-16]

    aes = AES.new(key, MODE, iv)
    encoder = PKCS7Encoder()   # Padding
    pad_text = encoder.encode(plaintext)
    encrypted_text = aes.encrypt(pad_text)

    concat = b"Salted__"+salt+encrypted_text
    return binascii.b2a_base64(concat).rstrip()  # Return b64encoded salted encrypted text


def decrypt_text(passphrase, encrypted_text):
    encrypted_text_bytes = binascii.a2b_base64(encrypted_text)
    encrypted_text_bytes = encrypted_text_bytes[8:]  # Remove "Salt__"

    salt = encrypted_text_bytes[:8]  # Get salt
    encrypted_text_bytes = encrypted_text_bytes[8:]

    resp = evpKDF(passphrase, salt, key_size=12)
    key = resp.get("key")
    iv = key[len(key)-16:]   # Initialization vector
    key = key[:len(key)-16]

    aes = AES.new(key, MODE, iv)
    decrypted_text = aes.decrypt(encrypted_text_bytes)
    encoder = PKCS7Encoder()  # Unpadding
    unpad_text = encoder.decode(decrypted_text.decode())
    return unpad_text


def make_timekey():
    timekey = date.today().strftime("%Y-%m-%d")
    return timekey


def make_encrypt_timekey(key):
    timekey = make_timekey()
    encrypt_timekey = encrypt_text(key, timekey)
    return encrypt_timekey


def decrypt_timekey(key, encrypt_timekey):
    decrypt_timekey = decrypt_text(key, encrypt_timekey)
    return decrypt_timekey


def encrypt_key(password):
    key = hashlib.sha256(str(password).encode('utf-8')).hexdigest()[15:47]
    return key


def secretkey_append_time(key, secretkey):  # input: secretkey, output: (AES Encrypted)timekey+secretkey
    user_secretkey = make_encrypt_timekey(key) + secretkey
    return user_secretkey


def parse_user_secretkey(key, user_secretkey):  # input: key, time_appended_secretkey, output: (Decrypted)timekey, secretkey
    timekey = decrypt_text(key, user_secretkey[:-30])
    secretkey = user_secretkey[-30:]
    return timekey, secretkey
