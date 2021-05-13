#!/usr/bin/env python3

import glob
import re
from itertools import chain
from os.path import basename
from os import makedirs

import yaml

TEMPLATE = """\
---
{front_matter}
---
{content}
"""


def pull_and_push_file(content, content_dir, data_dir):
    """
    Takes the content from a file from a github repo and
    pushed it to the doc
    See https://github.com/DataDog/documentation/wiki/Documentation-Build#pull-and-push-files to learn more
    :param content: object with a file_name, a file_path, and options to apply
    :param content_dir: The directory where content should be put
    :param data_dir: The directory where data should be put
    """
    for file_name in chain.from_iterable(
        glob.iglob(pattern, recursive=True)
        for pattern in content["globs"]
    ):
        with open(file_name, mode="r+") as f:
            file_content = f.read()
            # If options include front params, then the H1 title of the source file is striped
            # and the options front params are inlined
            if "front_matters" in content["options"]:
                front_matter = yaml.dump(content["options"]["front_matters"], default_flow_style=False).strip()
                # remove h1 if exists
                file_content = re.sub(re.compile(r"^#{1}(?!#)(.*)", re.MULTILINE), "", file_content, count=1)
                file_content = TEMPLATE.format(front_matter=front_matter, content=file_content.strip())

        if content["options"].get("is_data", False):
            path = '{}{}'.format(data_dir, content["options"]["dest_path"][1:])
            makedirs(path, exist_ok=True)
        else:
            path = '{}{}'.format(content_dir, content["options"]["dest_path"][1:])
        out_path = "{}{}".format(path, basename(content["options"].get("file_name", file_name)))
        with open(
            out_path,
            mode="w+",
            encoding="utf-8",
        ) as f:
            f.write(file_content)
