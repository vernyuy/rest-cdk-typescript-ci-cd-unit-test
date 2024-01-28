import { LambdaStack } from './lambda-stack';
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
// import * as apigw from "aws-cdk-lib/aws-apigateway";


export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props);

        // const {table, weatherApi} = props

        new LambdaStack(this, "lambdaStack", {
            env: { account: '132260253285', region: 'eu-west-2' },
            stageName: props?.stageName as string,
        })

    }
}