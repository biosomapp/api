import AWS from 'aws-sdk'
import { Request, Response } from 'express'
import { CustomRequest } from '../../../middlewares/authMiddleware'

const awsConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-1',
};

export const create = async (request: Request, response: Response) => {
  console.log('/sns request.headers', request.headers)
  console.log('/sns request.headers', request.headers['x-amz-sns-message-type'])
  console.log('is subscriptionConfirmation', request.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation')
  
  if (request.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
    console.log('entrou aws subscription confirmation')
    const arn = request.headers['x-amz-sns-topic-arn']
    const token = request.headers['x-amz-sns-message-id']

    const awsPromise = new AWS.SNS(awsConfig).confirmSubscription({ TopicArn: arn, Token : token }).promise()
    awsPromise.then(
      function(data: any) {
        console.log(data);
      }).catch(
        function(err: any) {
          console.log('deu erro')
          console.log(err)
        });
  }


  
    response.status(200).send()
}