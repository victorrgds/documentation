---
title: Run Synthetic Tests from Private Locations
kind: documentation
description: Run Synthetic API and browser tests from private locations
further_reading:
    - link: 'https://www.datadoghq.com/blog/synthetic-private-location-monitoring-datadog/'
      tag: 'Blog'
      text: 'Monitor your Synthetic private locations with Datadog'
    - link: /getting_started/synthetics/private_location
      tag: 'Documentation'
      text: 'Getting Started with Private Locations'
    - link: '/synthetics/private_locations/monitoring'
      tag: 'Documentation'
      text: 'Monitor your Private Locations'
    - link: '/synthetics/private_locations/dimensioning'
      tag: 'Documentation'
      text: 'Dimension your Private Locations'
    - link: '/synthetics/api_tests'
      tag: 'Documentation'
      text: 'Configure an API Test'
    - link: 'https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/synthetics_private_location'
      tag: 'Terraform'
      text: 'Create and manage Synthetic Private Locations with Terraform'
---

<div class="alert alert-warning">
The access to this feature is restricted. For access to this feature, or if you would like to be added to the Windows Private Location beta allowing you to run IE11 browser tests, reach out to <a href="https://docs.datadoghq.com/help/">Datadog support</a>.
</div>

## Overview

Private locations allow you to **monitor internal-facing applications or any private endpoints** that aren’t accessible from the public internet. They can also be used to:

* **Create custom Synthetic locations** in areas that are mission-critical to your business.
* **Verify application performance in your internal CI environment** before you release new features to production with [Synthetics and CI/CD][1].
* **Compare application performance** from both inside and outside your internal network.

Private locations come as Docker containers that you can install wherever makes sense inside of your private network. Once created and installed, you can assign [Synthetic tests][2] to your private location just like you would with any regular managed location.

Your private location worker pulls your test configurations from Datadog’s servers using HTTPS, executes the test on a schedule or on-demand, and returns the test results to Datadog’s servers. You can then visualize your private locations test results in a completely identical manner to how you would visualize tests running from managed locations:

{{< img src="synthetics/private_locations/test_results_pl.png" alt="Assign a Synthetic test to a private location"  style="width:100%;">}}

## Prerequisites

### Docker

Private locations are Docker containers that you can install anywhere inside your private network. You can access the [private location worker image][3] on Google Container Registry. It can run on a Linux based OS or Windows OS if the [Docker engine][4] is available on your host and can run in Linux containers mode.

### Datadog private locations endpoints

To pull test configurations and push test results, the private location worker needs access to the below Datadog API endpoints.

{{< site-region region="us" >}}

| Port | Endpoint                                                                                             | Description                                                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 443  | `intake.synthetics.datadoghq.com` for version >=0.1.6, `api.datadoghq.com` for versions <=0.1.5   | Used by the private location to pull test configurations and push test results to Datadog using an in-house protocol based on [AWS Signature Version 4 protocol][1]. |
| 443  | `intake-v2.synthetics.datadoghq.com` for versions >=0.2.0 and <=1.4.0                                            | Used by the private location to push browser test artifacts (screenshots, errors, resources).                                                                         |

[1]: https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html

{{< /site-region >}}

{{< site-region region="eu" >}}

| Port | Endpoint                                               | Description                                                                                   |
| ---- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 443  | `api.datadoghq.eu`                                | Used by the private location to pull test configurations and push test results to Datadog using an in-house protocol based on [AWS Signature Version 4 protocol][1]. |
| 443  | `intake-v2.synthetics.datadoghq.eu` for versions >=0.2.0 and <=1.5.0 | Used by the private location to push browser test artifacts (screenshots, errors, resources).                                                                            |

**Note**: These domains are pointing to a set of static IP addresses. These addresses can be found at https://ip-ranges.datadoghq.eu, specifically at https://ip-ranges.datadoghq.eu/api.json for `api.datadoghq.eu` and at https://ip-ranges.datadoghq.eu/synthetics-private-locations.json for `intake-v2.synthetics.datadoghq.eu`.

[1]: https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html

{{< /site-region >}}

{{< site-region region="us3" >}}

| Port | Endpoint                                                                                             | Description                                                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 443  | `intake.synthetics.us3.datadoghq.com` | Used by the private location to pull test configurations and push test results to Datadog using an in-house protocol based on [AWS Signature Version 4 protocol][1]. |

[1]: https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html

{{< /site-region >}}

{{< site-region region="gov" >}}

| Port | Endpoint                                                                                             | Description                                                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 443  | `intake.synthetics.ddog-gov.com` | Used by the private location to pull test configurations and push test results to Datadog using an in-house protocol based on [AWS Signature Version 4 protocol][1]. |

[1]: https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html

{{< /site-region >}}

### Permissions

By default, only users with the Datadog Admin Role can create private locations, delete private locations, and access private location installation guidelines. Users with the [Datadog Admin][20] and [Datadog Standard roles][20] can view private locations, search for private locations, and assign Synthetic tests to private locations. You can get access to the **Private Locations** page by having your user upgraded to one of these two [default roles][19]. 

If you have access to the [custom role feature][18], add users to a custom role that includes `synthetics_private_location_read` and `synthetics_private_location_write` permissions. 

## Set up your private location

### Create your private location

Navigate to **Synthetic Monitoring** > **Settings** > **Private Locations** and click **Add Private Location**.

{{< img src="synthetics/private_locations/synthetics_pl_add.png" alt="create a private location"  style="width:100%;">}}

**Note**: Only **Admin** users can create private locations.

Fill out your private location details: 

1. Specify your private location's **Name** and **Description**.
2. Add any **Tags** you would like to associate with your private location.
3. Choose one of your existing **API Keys**. Selecting an API key allows communication between your private location and Datadog. If you don't have an existing API key, you can click **Generate API key** and create one on the dedicated page.

**Note:** Only `Name` and `API key` fields are mandatory.

Then click **Save Location and Generate Configuration File** to create your private location and generate the associated configuration file (visible in **Step 3**).

{{< img src="synthetics/private_locations/pl_creation.png" alt="Add details to private location"  style="width:100%;">}}

### Configure your private location

Configure your private location by customizing the generated configuration file. Initial configuration parameters like [proxy](#proxy-configuration) and [blocked reserved IPs](#blocking-reserved-ips) are added in **Step 2** and are automatically reflected in the **Step 3** configuration file. Depending on your internal network setup, you may want to configure your private location with [advanced options](#advanced-configuration).

#### Proxy configuration

If the traffic between your private location and Datadog has to go through a proxy, specify your proxy URL with the following format: `http://<YOUR_USER>:<YOUR_PWD>@<YOUR_IP>:<YOUR_PORT>` to add the associated `proxyDatadog` parameter to your generated configuration file.

{{<img src="synthetics/private_locations/pl_proxy.png" alt="Add a proxy to your private location configuration file" style="width:100%;">}}

[Advanced proxy configuration options][5] are available.

#### Blocking reserved IPs

By default, Synthetic users can create Synthetic tests on endpoints using any IP. If you want to prevent users from creating tests on sensitive internal IPs in your network, toggle the **Block reserved IPs** button to block a default set of reserved IP ranges ([IPv4 address registry][6] and [IPv6 address registry][7]) and set the associated `enableDefaultBlockedIpRanges` parameter to `true` in your generated configuration file.

If some of the endpoints you are willing to test are located within one or several of the blocked reserved IP ranges, you can add their IPs and/or CIDRs to the allowed lists to add the associated `allowedIPRanges` parameters to your generated configuration file.

{{< img src="synthetics/private_locations/pl_reserved_ips.png" alt="Configure reserved IPs"  style="width:100%;">}}

[Advanced reserved IPs configuration options][8] are available.

#### Advanced configuration

[Advanced configuration options][9] are available and can be found by running the below `help` command:

```shell
docker run --rm datadog/synthetics-private-location-worker --help
```

### View your configuration file

After adding the appropriate options to your private location configuration file, you can copy paste the file to your working directory.

{{< img src="synthetics/private_locations/pl_view_file.png" alt="Configure reserved IPs"  style="width:100%;">}}

**Note**: The configuration file contains secrets for private location authentication, test configuration decryption, and test result encryption. Datadog does not store the secrets, so store them locally before leaving the Private Locations screen. **You need to be able to reference these secrets again if you decide to add more workers, or to install workers on another host.**

### Install your private location

**Note:** If you wish to use environment variables in your task definition, you can use the following environment variables: `DATADOG_API_KEY`, `DATADOG_ACCESS_KEY`, `DATADOG_SECRET_ACCESS_KEY`, and`DATADOG_PRIVATE_KEY`.

Launch your private location on:

{{< tabs >}}

{{% tab "Docker" %}}

Run this command to boot your private location worker by mounting your configuration file to the container. Ensure that your `<MY_WORKER_CONFIG_FILE_NAME>.json` file is in `/etc/docker`, not the root home folder:

```shell
docker run --rm -v $PWD/<MY_WORKER_CONFIG_FILE_NAME>.json:/etc/datadog/synthetics-check-runner.json datadog/synthetics-private-location-worker:latest
```

**Note:** If you blocked reserved IPs, make sure to add the `NET_ADMIN` [Linux capabilities][1] to your private location container.

This command starts a Docker container and makes your private location ready to run tests. **Datadog recommends running the container in detached mode with proper restart policy.**

[1]: https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities

{{% /tab %}}

{{% tab "Docker Compose" %}}

1. Create a `docker-compose.yml` file with:

    ```yaml
    version: "3"
    services:
        synthetics-private-location-worker:
            image: datadog/synthetics-private-location-worker:latest
            volumes:
                - PATH_TO_PRIVATE_LOCATION_CONFIG_FILE:/etc/datadog/synthetics-check-runner.json
    ```
    **Note:** If you blocked reserved IPs, make sure to add the `NET_ADMIN` [Linux capabilities][1] to your private location container.

2. Start your container with:

```shell
docker-compose -f docker-compose.yml up
```

[1]: https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities

{{% /tab %}}

{{% tab "Kubernetes Deployment" %}}

1. Create a Kubernetes ConfigMap with the previously created JSON file by executing the following:

    ```shell
    kubectl create configmap private-location-worker-config --from-file=<MY_WORKER_CONFIG_FILE_NAME>.json
    ```

2. Take advantage of deployments to describe the desired state associated with your private locations. Create the following `private-location-worker-deployment.yaml` file:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: datadog-private-location-worker
      namespace: default
    spec:
      selector:
        matchLabels:
          app: private-location
      template:
        metadata:
          name: datadog-private-location-worker
          labels:
            app: private-location
        spec:
          containers:
          - name: datadog-private-location-worker
            image: datadog/synthetics-private-location-worker
            volumeMounts:
            - mountPath: /etc/datadog/synthetics-check-runner.json
              name: worker-config
              subPath: <MY_WORKER_CONFIG_FILE_NAME>
          volumes:
          - name: worker-config
            configMap:
              name: private-location-worker-config
    ```

    **Note:** If you blocked reserved IPs, make sure to add the `NET_ADMIN` [Linux capabilities][1] to your private location container.

3. Apply the configuration:

    ```shell
    kubectl apply -f private-location-worker-deployment.yaml
    ```

[1]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

{{% /tab %}}

{{% tab "Helm Chart" %}}

1. Add the [Datadog Synthetics Private Location][1] to your Helm repositories:

    ```shell
    helm repo add datadog https://helm.datadoghq.com 
    helm repo update
    ```

2. Install the chart with the release name `<RELEASE_NAME>`, using the previously created JSON file by executing the following:

    ```shell
    helm install <RELEASE_NAME> datadog/synthetics-private-location --set-file configFile=<MY_WORKER_CONFIG_FILE_NAME>.json
    ```

    **Note:** If you blocked reserved IPs, make sure to add the `NET_ADMIN` [Linux capabilities][2] to your private location container.

[1]: https://github.com/DataDog/helm-charts/tree/master/charts/synthetics-private-location
[2]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

{{% /tab %}}

{{% tab "ECS" %}}

Create a new EC2 task definition matching the below. Make sure to replace each parameter by the corresponding value found in your previously generated private location configuration file:

```yaml
{
    ...
    "containerDefinitions": [
        {
            "command": [
                "--site='...'",
                "--locationID='...'",
                "--accessKey='...'",
                "--datadogApiKey='...'",
                "--secretAccessKey='...'",
                "--privateKey='-----BEGIN RSA PRIVATE KEY-----XXXXXXXX-----END RSA PRIVATE KEY-----'",
                "--publicKey.pem='-----BEGIN PUBLIC KEY-----XXXXXXXX-----END PUBLIC KEY-----'",
                "--publicKey.fingerprint='...'"
            ],
            ...
            "image": "datadog/synthetics-private-location-worker:latest",
            ...
        }
    ],
    ...
    "compatibilities": [
        "EC2"
    ],
    ...
}
```

**Note:** If you blocked reserved IPs, make sure to configure a [linuxParameters][1] to grant `NET_ADMIN` capabilities to your private location containers.

[1]: https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_LinuxParameters.html

{{% /tab %}}

{{% tab "Fargate" %}}

Create a new Fargate task definition matching the below. Make sure to replace each parameter by the corresponding value found in your previously generated private location configuration file:

```yaml
{
    ...
    "containerDefinitions": [
        {
            "command": [
                "--site='...'",
                "--locationID='...'",
                "--accessKey='...'",
                "--datadogApiKey='...'",
                "--secretAccessKey='...'",
                "--privateKey='-----BEGIN RSA PRIVATE KEY-----XXXXXXXX-----END RSA PRIVATE KEY-----'",
                "--publicKey.pem='-----BEGIN PUBLIC KEY-----XXXXXXXX-----END PUBLIC KEY-----'",
                "--publicKey.fingerprint='...'"
            ],
            ...
            "image": "datadog/synthetics-private-location-worker:latest",
            ...
        }
    ],
    ...
    "compatibilities": [
        "EC2",
        "FARGATE"
    ],
    ...
}
```

**Notes:** 

If you wish to use environment variables in your task definition, note that Fargate Private Location deployment uses different environment variables than other parts of Datadog. For Fargate, use the following environment variables: `DATADOG_API_KEY`, `DATADOG_ACCESS_KEY`, `DATADOG_SECRET_ACCESS_KEY`, `DATADOG_PRIVATE_KEY`.

The private location firewall option is not supported on AWS Fargate—the `enableDefaultBlockedIpRanges` parameter can consequently not be set to `true`.

{{% /tab %}}

{{% tab "EKS" %}}

Because Datadog already integrates with Kubernetes and AWS, it is ready-made to monitor EKS.

1. Create a Kubernetes ConfigMap with the previously created JSON file by executing the following:

    ```shell
    kubectl create configmap private-location-worker-config --from-file=<MY_WORKER_CONFIG_FILE_NAME>.json
    ```

2. Take advantage of deployments to describe the desired state associated with your private locations. Create the following `private-location-worker-deployment.yaml` file:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: datadog-private-location-worker
      namespace: default
    spec:
      selector:
        matchLabels:
          app: private-location
      template:
        metadata:
          name: datadog-private-location-worker
          labels:
            app: private-location
        spec:
          containers:
          - name: datadog-private-location-worker
            image: datadog/synthetics-private-location-worker
            volumeMounts:
            - mountPath: /etc/datadog/synthetics-check-runner.json
              name: worker-config
              subPath: <MY_WORKER_CONFIG_FILE_NAME>
          volumes:
          - name: worker-config
            configMap:
              name: private-location-worker-config
    ```

    **Note:** If you blocked reserved IPs, make sure to configure a security context to grant `NET_ADMIN` [Linux capabilities][1] to your private location containers.

3. Apply the configuration:

    ```shell
    kubectl apply -f private-location-worker-deployment.yaml
    ```

[1]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

{{% /tab %}}

{{< /tabs >}}

#### Set up healthchecks

Add a [healthcheck][10] mechanism so your orchestrator can ensure the workers are running correctly.

The `/tmp/liveness.date` file of private location containers gets updated after every successful poll from Datadog (2s by default). The container is considered unhealthy if no poll has been performed in a while, for example: no fetch in the last minute.

Use the below configuration to set up healthchecks on your containers with:

{{< tabs >}}

{{% tab "Docker Compose" %}}

```yaml
healthcheck:
  retries: 3
  test: [
    "CMD", "/bin/sh", "-c", "'[ $$(expr $$(cat /tmp/liveness.date) + 300000) -gt $$(date +%s%3N) ]'"
  ]
  timeout: 2s
  interval: 10s
  start_period: 30s
```

{{% /tab %}}

{{% tab "Kubernetes Deployment" %}}

```yaml
livenessProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - '[ $(expr $(cat /tmp/liveness.date) + 300000) -gt $(date +%s%3N) ]'
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3
```

{{% /tab %}}

{{% tab "Helm Chart" %}}

```yaml
livenessProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - '[ $(expr $(cat /tmp/liveness.date) + 300000) -gt $(date +%s%3N) ]'
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3
```

{{% /tab %}}

{{% tab "ECS" %}}

```json
"healthCheck": {
  "retries": 3,
  "command": [
    "CMD-SHELL", "/bin/sh -c '[ $(expr $(cat /tmp/liveness.date) + 300000) -gt $(date +%s%3N) ]'"
  ],
  "timeout": 2,
  "interval": 10,
  "startPeriod": 30
}
```

{{% /tab %}}

{{% tab "Fargate" %}}

```json
"healthCheck": {
  "retries": 3,
  "command": [
    "CMD-SHELL", "/bin/sh -c '[ $(expr $(cat /tmp/liveness.date) + 300000) -gt $(date +%s%3N) ]'"
  ],
  "timeout": 2,
  "interval": 10,
  "startPeriod": 30
}
```

{{% /tab %}}

{{% tab "EKS" %}}

```yaml
livenessProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - '[ $(expr $(cat /tmp/liveness.date) + 300000) -gt $(date +%s%3N) ]'
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3
```

{{% /tab %}}

{{< /tabs >}}

### Test your internal endpoint

Once at least one private location container starts reporting to Datadog the private location status is set to green:

{{< img src="synthetics/private_locations/pl_reporting.png" alt="Private location reporting"  style="width:100%;">}}

You can then start testing your first internal endpoint by launching a fast test on one of your internal endpoints and see if you get the expected response:

{{< img src="synthetics/private_locations/pl_fast_test.mp4" alt="Fast test on private location" video="true" width="100%">}}

**Note::** Datadog only sends outbound traffic from your private location, no inbound traffic is transmitted.

## Launch Synthetic tests from your private location

If your private location reports correctly to Datadog, you should see a `REPORTING` health status displayed in the Private Locations list on the **Settings** page:

{{< img src="synthetics/private_locations/pl_monitoring_table_reporting.png" alt="Private location health" style="width:100%;">}}

You can then go to any of your API or Browser test creation form, and tick your **Private locations** of interest to have them run your Synthetic test on schedule:

{{< img src="synthetics/private_locations/assign-test-pl-2.png" alt="Assign Synthetic test to private location"  style="width:100%;">}}

Your private locations can be used just like any other Datadog managed locations: assign [Synthetic tests][2] to private locations, visualize test results, get [Synthetic metrics][11], etc.

## Scale your private location

Because you can run several containers for one single private location with a single configuration file, you can **horizontally scale** your private locations by adding or removing workers to them. When doing so, make sure to set a `concurrency` parameter and allocate worker resources that are consistent with the types and the number of tests you want your private location to execute.

You can also **vertically scale** your private locations by increasing the load your private location containers can handle. Similarly, you should use the `concurrency` parameter to adjust the maximum number of test your workers allowed to run and update the resources allocated to your workers.

For more information, see [Dimensioning private locations][18].

## Monitor your private location

While you initially add resources that are consistent with the number and type of tests to execute from your private location, the easiest way to know if you should downscale or upscale your private location is to closely monitor them. [Private Location Monitoring][19] provides insight about the performance and state of your private location as well as out-of-the-box metrics and monitors. 

For more information, see [Private Location Monitoring][19].



## Further Reading

{{< partial name="whats-next/whats-next.html" >}}

[1]: /synthetics/cicd_testing
[2]: /synthetics/
[3]: https://console.cloud.google.com/gcr/images/datadoghq/GLOBAL/synthetics-private-location-worker?pli=1
[4]: https://docs.docker.com/engine/install/
[5]: /synthetics/private_locations/configuration/#proxy-configuration
[6]: https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml
[7]: https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml
[8]: /synthetics/private_locations/configuration/#reserved-ips-configuration
[9]: /synthetics/private_locations/configuration/
[10]: https://docs.docker.com/engine/reference/builder/#healthcheck
[11]: /synthetics/metrics
[12]: /synthetics/api_tests/
[13]: /synthetics/multistep?tab=requestoptions
[14]: /synthetics/browser_tests/?tab=requestoptions
[15]: /synthetics/private_locations/configuration#advanced-configuration
[16]: /agent/
[17]: /synthetics/metrics/
[18]: /synthetics/private_locations/dimensioning
[19]: /synthetics/private_locations/monitoring