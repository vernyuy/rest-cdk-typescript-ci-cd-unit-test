import { LambdaStack } from './lambda-stack';
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

interface PipelineStageProps extends StageProps {
    table: dynamodb.ITable,
    weatherApi: apigw.IRestApi
}

export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props: PipelineStageProps) {
        super(scope, id, props);

        const {table, weatherApi} = props

        new LambdaStack(this, "lambdaStack", {
            stageName: "Test",
            table: table,
            weatherApi: weatherApi
        })

    }
}