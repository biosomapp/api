import AWS from 'aws-sdk'
import { Request, Response } from 'express'
import { CustomRequest } from '../../../middlewares/authMiddleware'

const awsConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-1',
};

AWS.config.update(awsConfig)

export const create = async (request: Request, response: Response) => {
  console.log('/sns request.headers', request.headers)
  console.log('/sns request.headers', request.headers['x-amz-sns-message-type'])
  console.log('is subscriptionConfirmation', request.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation')
  
  if (request.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
    console.log('entrou aws subscription confirmation')
    const arn = request.headers['x-amz-sns-topic-arn']?.toString()
    const token = request.headers['x-amz-sns-message-id']?.toString()
    console.log('arn', arn)
    console.log('token', token)

    if (!arn || !token) return
    const params = {
      TopicArn: arn,
      Token: token
    }
    const awsPromise = new AWS.SNS()
    

    console.log('params', params)
    awsPromise.confirmSubscription(params, function(err, data) {
      console.log('erro', err)
      console.log('success data', data)
    })

  }


  
    response.status(200).send()
}