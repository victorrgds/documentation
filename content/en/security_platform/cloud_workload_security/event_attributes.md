---
title: Cloud Workload Security Events
kind: documentation
description: "Event format, schema, and attributes for Cloud Workload Security"
further_reading:
- link: "/security_platform/cloud_workload_security/getting_started/"
  tag: "Documentation"
  text: "Get started with Datadog Cloud Workload Security"
---

## Base Event Format

All Cloud Workload Security (CWS) events share a basic event format. CWS events include metadata about event types, and policy/rule information, followed by three core sets of context: file process, and user.

### Base Event Format
All events have `agent`, `evt`, `file`, `process`, and `user` contexts. Optionally, if activity is associated with a container, then there will also be a `container` context.

{{< code-block lang="json" filename="base-payload.json" datafile="data/security_schemas/exec.schema.json" >}}{{< /code-block >}}

### Event Context
The event context contains information about the type of activity that triggered a rule. This includes activity category, name, and whether or not the activity was successful (i.e a process failing or succeeding to execute).

{{< code-block lang="json" filename="event.json" datafile="data/security_schemas/event.json" >}}{{< /code-block >}}

### Agent Context
Agent context contains information about what policy is running on the given agent, which version of that policy, and which specific rule from the policy was matched to trigger the event in question.

```json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "agent.json",
    "type": "object",
    "properties": {
        "agent": {
            "type": "object",
            "properties": {
                "policy_name": {
                    "type": "string"
                },
                "policy_version": {
                    "type": "string"
                },
                "rule_id": {
                    "type": "string"
                }
            },
            "required": [
                "policy_name",
                "policy_version",
                "rule_id"
            ]
        }
    },
    "required": [
        "agent"
    ]
}
```

### File Context
File context includes all of the information known about a file. This includes the files path, flags, inode, mount, and more. If the file is associated with a container, then the container mount path is also included.

{{< code-block lang="json" filename="file.json" datafile="data/security_schemas/file.json" >}}{{< /code-block >}}

#### Process Context
Process context includes all information known about the process associated with the activity in question. This includes process-specific information, as well as a full process ancestory tree, container information if available, and specific parent process information.

{{< code-block lang="json" filename="process_context.json" datafile="data/security_schemas/process_context.json" >}}{{< /code-block >}}

#### Process
Cloud Worload Security collects highly detailed process information, such as the process path, name, arguments, environment variable keys, tty, user/group information, and kernel capabilities (effective and permitted). Note: some information is not collected for ancestors, such and arguments, and environment variables

{{< code-block lang="json" filename="process.json" datafile="data/security_schemas/process.json" >}}{{< /code-block >}}

#### User Context
User context includes the resolved user and group information of the executing process. Note: This information is resolved at the time of collection. Therefore, it is possible for resolved users and groups to have changed since the activity took place, or after the activity is collected.

{{< code-block lang="json" filename="usr.json" datafile="data/security_schemas/usr.json" >}}{{< /code-block >}}
