import socket
import os
import time


def get_base_directory():
    return os.path.dirname(os.path.abspath(__file__))


def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(('8.8.8.8', 80))
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address


def query_serializer(schema, query_result):
    ret = []
    for result in query_result:
        ret.append(schema.dump(result).data)
    return ret


def timer(tag_name):
    def time_decorator(func):
        def func_wrapper(*args, **kwargs):
            time1 = time.time()
            ret = func(*args, **kwargs)
            time2 = time.time()
            print("Time: {} processing time: {}".format(tag_name, time2 - time1))
            return ret

        return func_wrapper

    return time_decorator
