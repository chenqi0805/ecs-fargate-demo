import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Vpc} from "aws-cdk-lib/aws-ec2";
import {Cluster, ContainerImage, FargateTaskDefinition, Protocol} from "aws-cdk-lib/aws-ecs";
import {ApplicationLoadBalancedFargateService} from "aws-cdk-lib/aws-ecs-patterns";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class EcsFargateAlbDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'EcsFargateDemoQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const vpc = new Vpc(this, 'MyVpc', { maxAzs: 2 });
    const cluster = new Cluster(this, 'Cluster', { vpc });

    const taskDef = new FargateTaskDefinition(this, "MyTaskDefinition", {
      memoryLimitMiB: 512,
      cpu: 256,
    })

    taskDef.addContainer("AppContainer", {
      image: ContainerImage.fromRegistry("httpd:2.4"),
      portMappings: [{
        containerPort: 80,
        hostPort: 80,
        protocol: Protocol.TCP
      }],
      entryPoint: ["sh", "-c"],
      command:  [
        "/bin/sh -c \"echo '<html> <head> <title>Amazon ECS Sample App</title> " +
        "<style>body {margin-top: 40px; background-color: #333;} </style> </head><body> " +
        "<div style=color:white;text-align:center> <h1>Amazon ECS Sample App</h1> <h2>Congratulations!</h2> <p>Your " +
        "application is now running on a container in Amazon ECS.</p> </div></body></html>' > " +
        "/usr/local/apache2/htdocs/index.html && httpd-foreground\""
      ],
    })

    // Instantiate Fargate Service with just cluster and image
    new ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 3
    });
  }
}
