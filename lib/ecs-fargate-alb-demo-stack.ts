import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Vpc} from "aws-cdk-lib/aws-ec2";
import {Cluster, ContainerImage} from "aws-cdk-lib/aws-ecs";
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

    // Instantiate Fargate Service with just cluster and image
    new ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      desiredCount: 3
    });
  }
}
