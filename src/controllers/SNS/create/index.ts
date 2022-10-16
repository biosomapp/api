import AWS from 'aws-sdk'
import { Request, Response } from 'express'
import { AWSSNSLog } from '../../../mongo'
import { CustomRequest } from '../../../middlewares/authMiddleware'

const awsConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-1',
};

AWS.config.update(awsConfig)

export const create = async (request: Request, response: Response) => {
  const body = typeof request.body !== 'object' ? JSON.parse(request.body) : request.body
  console.log('==> isBodyObject', typeof request.body === 'object')
  console.log('==> body', body)

  const newAWSSNSLog = {
    snapshot: body
  }
  await AWSSNSLog.create(newAWSSNSLog)
  
  const arn = request.headers['x-amz-sns-topic-arn']?.toString()
  if (request.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
    console.log('entrou aws subscription confirmation')
    console.log('arn', arn)
    console.log('token', body.Token)

    if (!arn || !body.Token) return
    const params = {
      TopicArn: arn,
      Token: body.Token
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