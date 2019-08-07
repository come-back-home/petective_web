import re
import inflect


engine = inflect.engine()


def get_plural(s):
    return engine.plural(s)


def convert_camel_to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def get_type_casting_function_name(variable_type):
    if variable_type == "Integer":
        return "int"
    elif variable_type == "String":
        return "str"
    elif variable_type == "Text":
        return "str"
    elif variable_type == "DateTime":
        return "datetime"
    elif variable_type == "Float":
        return "float"
    return None


def convert_flake8_to_original(_class):
    ret = ''
    lines = _class.split('\n')
    for i in range(len(lines)):
        line = lines[i]
        if ~line.find('Column') and line.find(')') == -1:
            ret += lines[i].strip() + lines[i+1].strip() + '\n'
            i += 1
        else:
            ret += lines[i].strip() + '\n'
    return ret


def generator(filename):
    with open(filename, 'r') as fp:
        s = fp.read().strip()

    s = s[s.find('class'):]
    classes = s.split('class ')
    class_list = []

    for c in classes:
        c = c.strip()
        if len(c) == 0:
            continue
        class_name = c.split('(')[0].strip()
        if class_name == 'BaseModel':
            continue
        c = convert_flake8_to_original(c)
        lines = c.split('\n')
        variables = []
        variables_type = {}
        variables_for_construct = []
        for line in lines:
            if ~line.find('Column'):
                variable = line.split('=')[0].strip()
                variable_type = line.split('(')[1]\
                    .split(')')[0].split(',')[0].split('.')[1]
                variables_type[variable] = variable_type.strip()
                variables.append(variable)
            if ~line.find('__init__'):
                l2 = line.split('(')[1].split(')')[0].split(',')
                l2 = list(map(lambda x: x.split('=')[0].strip(), l2[1:]))
                variables_for_construct = l2

        class_list.append({
            "class_name": class_name,
            "variables": variables,
            "variables_for_construct": variables_for_construct,
            "variables_type": variables_type
            })

    ans = ""

    ans += "from serializer import ("
    for i in range(len(class_list)):
        if i != 0:
            ans += ", "
        class_name = class_list[i]['class_name']
        ans += "{}Schema".format(class_name)
    ans += ")\n\n"

    for class_item in class_list:
        class_name = class_item['class_name']
        variables = class_item['variables']
        variables_type = class_item['variables_type']
        variables_for_construct = class_item['variables_for_construct']

        ans += "class {}List(Resource):\n".format(class_name)
        ans += "\tdef get(self):\n"
        for variable in variables:
            ans += "\t\t_{} = get_request_arg(\"{}\", None)\n"\
                .format(variable, variable)
        ans += "\t\t{} = {}.query\n".format(
            get_plural(convert_camel_to_snake(class_name)), class_name)
        for variable in variables:
            ans += "\t\tif _{} is not None:\n".format(variable)
            ans += "\t\t\t{} = {}.filter_by({}=_{})\n".format(
                get_plural(convert_camel_to_snake(class_name)),
                get_plural(convert_camel_to_snake(class_name)),
                variable, variable)
        ans += "\t\t{} = {}.all()\n".format(
            get_plural(convert_camel_to_snake(class_name)),
            get_plural(convert_camel_to_snake(class_name)))
        ans += "\t\tserialized_result = query_serializer({}Schema(), {})\n"\
            .format(class_name, get_plural(convert_camel_to_snake(class_name)))
        ans += "\t\treturn jsonify(serialized_result)\n\n"
        ans += "\tdef post(self):\n"
        ans += "\t\ttry:\n"
        for variable in variables_for_construct:
            variable_type = variables_type[variable]
            if variable_type == "Integer":
                ans += "\t\t\t_{} = {}(request.form[\"{}\"])\n".format(
                    variable, "int", variable)
            elif variable_type == "String":
                ans += "\t\t\t_{} = {}(request.form[\"{}\"])\n".format(
                    variable, "str", variable)
            elif variable_type == "Text":
                ans += "\t\t\t_{} = {}(request.form[\"{}\"])\n".format(
                    variable, "str", variable)
            elif variable_type == "DateTime":
                ans += "\t\t\t_year,_month,_day = "\
                    + "map(int, request.form[\"{}\"]"\
                    + ".split(\"-\"))\n".format(variable)
                ans += "\t\t\t_{} = datetime(year=_year,"\
                    + " month=_month, day=_day)\n".format(variable)
            elif variable_type == "Float":
                ans += "\t\t\t_{} = {}(request.form[\"{}\"])\n".format(
                    variable, "float", variable)
            else:
                ans += "\t\t\t_{} = request.form[\"{}\"]\n"\
                    .format(variable, variable)
        ans += "\t\texcept Exception as e:\n"
        ans += "\t\t\tprint(e)\n"
        ans += "\t\t\tabort(400)\n"
        ans += "\t\tnew_{} = {}(_{})\n".format(
            convert_camel_to_snake(class_name),
            class_name, ', _'.join(variables_for_construct))
        ans += "\t\tdb.session.add(new_{})\n".format(
            convert_camel_to_snake(class_name))
        ans += "\t\ttry:\n"
        ans += "\t\t\tdb.session.commit()\n"
        ans += "\t\texcept Exception as e:\n"
        ans += "\t\t\tdb.session.rollback()\n"
        ans += "\t\t\tprint(e)\n"
        ans += "\t\t\tabort(500)\n"
        ans += "\t\t_{} = {}.query.filter_by(id=new_{}.id).first()\n".format(
            convert_camel_to_snake(class_name),
            class_name, convert_camel_to_snake(class_name))
        ans += "\t\tserialized_result = query_serializer"\
            + "({}Schema(), [_{}])[0]\n"\
            .format(class_name, convert_camel_to_snake(class_name))
        ans += "\t\treturn jsonify(serialized_result)\n"
        ans += "\n\n"

        ans += "class {}Item(Resource):\n".format(class_name)

        ans += "\tdef get(self, _id):\n"
        ans += "\t\t{} = {}.query.filter_by(id=_id).first()\n".format(
            convert_camel_to_snake(class_name), class_name)
        ans += "\t\tserialized_result ="\
            + " query_serializer({}Schema(), [{}])[0]\n"\
            .format(class_name, convert_camel_to_snake(class_name))
        ans += "\t\treturn jsonify(serialized_result)\n\n"
        ans += "\tdef put(self, _id):\n"
        ans += "\t\ttry:\n"
        ans += "\t\t\t_{} = {}.query.filter_by(id=_id).first()\n".format(
            convert_camel_to_snake(class_name),
            class_name)
        ans += "\t\texcept Exception as e:\n"
        ans += "\t\t\tabort(400)\n"
        for variable in variables:
            ans += "\t\tif \'{}\' in request.form:\n".format(variable)
            if get_type_casting_function_name(
                    variables_type[variable]) is None:
                ans += "\t\t\t_{}.{} = request.form[\'{}\']\n".format(
                    convert_camel_to_snake(class_name), variable, variable)
            else:
                if get_type_casting_function_name(
                        variables_type[variable]) == "datetime":
                    ans += "\t\t\t_year, _month, _day = map"\
                        + "(int, request.form[\"{}\"].split(\"-\"))\n"\
                        .format(variable)
                    ans += "\t\t\t_{}.{} = datetime"\
                        .format(convert_camel_to_snake(class_name), variable)\
                        + "(year=_year, month=_month, day=_day)\n"
                else:
                    ans += "\t\t\t_{}.{} = {}(request.form[\'{}\'])\n".format(
                        convert_camel_to_snake(class_name),
                        variable,
                        get_type_casting_function_name(
                            variables_type[variable]), variable)
        ans += "\t\ttry:\n"
        ans += "\t\t\tdb.session.commit()\n"
        ans += "\t\texcept Exception as e:\n"
        ans += "\t\t\tdb.session.rollback()\n"
        ans += "\t\t\tprint(e)\n"
        ans += "\t\t\tabort(500)\n"
        ans += "\t\t_{} = {}.query.filter_by(id=_id).first()\n".format(
            convert_camel_to_snake(class_name), class_name)
        ans += "\t\tserialized_result = query_serializer"\
            + "(\n\t\t\t{}Schema(), [_{}])[0]\n"\
            .format(class_name, convert_camel_to_snake(class_name))
        ans += "\t\treturn jsonify(serialized_result)\n\n"

        ans += "\tdef delete(self, _id):\n"
        ans += "\t\t_{} = {}.query.filter_by(id=_id).first()\n".format(
            convert_camel_to_snake(class_name), class_name)
        ans += "\t\tdb.session.delete(_{})\n"\
            .format(convert_camel_to_snake(class_name))
        ans += "\t\ttry:\n"
        ans += "\t\t\tdb.session.commit()\n"
        ans += "\t\texcept Exception as e:\n"
        ans += "\t\t\tprint(e)\n"
        ans += "\t\t\tabort(500)\n"
        ans += "\t\treturn jsonify({\"message\": \"delete successfuly\"})\n"
        ans += "\n\n"

    for class_item in class_list:
        class_name = class_item['class_name']
        ans += "api.add_resource({}List, '/api/{}')\n"\
            .format(class_name, get_plural(convert_camel_to_snake(class_name)))
        ans += "api.add_resource({}Item, '/api/{}/<int:_id>')\n"\
            .format(class_name, get_plural(convert_camel_to_snake(class_name)))

    print(ans)


if __name__ == '__main__':
    generator("models.py")
