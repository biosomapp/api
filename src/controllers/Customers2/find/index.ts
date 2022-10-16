import { Response } from 'express'
import AWS from 'aws-sdk'
import db from '../../../models'
import { CustomRequest } from '../../../middlewares/authMiddleware'

const sleep = async (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-east-1',
  };

  const emailBody = `<p>Oi, tudo bem?
  <br><br>
  Mais praticidade e segurança. Agora você consegue assinar o Hearing Guardian da Biosom também <strong>via PIX</strong>.
<br><br>
Para celebrar, estamos com uma promoção de <strong>20% no plano mensal e 50% no plano anual</strong>.
<br><br>
<strong>Aproveite essa promoção</strong> respondendo este email informando o plano que deseja. Enviaremos a fatura com a chave PIX e também opção para cartão de crédito.
<br><br>
<strong>Planos e descontos:</strong>
<br>
<ul>
  <li>Plano mensal: de R$ <strike> 24,99</strike> por <strong>R$ 19,90</strong></li>
  <li>Plano anual: de R$ <strike> 299,00</strike> por <strong>R$ 149,50</strong></li>
</ul>
<br><br>
Aproveite para atualizar o seu app. <strong>Para atualizar, vá em <a href="https://play.google.com/store/apps/details?id=com.biosom.hearingguardianapp&referrer=utm_source%email%2520updateinfo%2520awsses">Google Play, procure por Hearing Guardian</a> e faça o download ou atualização</strong>.
<br><br>
Ficamos no aguardo!
<br><br>
Qualquer dúvida, estamos à disposição
<br><br>
Att,<br>
Paulo | Equipe Biosom
</p>  
      `
  
  const params: any = {
    Source: 'contato@biosom.com.br',
    Destination: {
        ToAddresses: ['rafaelbuenolink@gmail.com'],
    },
    ReplyToAddresses: ['contato@biosom.com.br'],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: emailBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'PIX Liberado com 20% a 50% de desconto',
      },
    },
  };
  
  const bulkEmail = async (startPage: number, endPage: number, perPage: number) => {
    try {
        async function recursiveEmailSent(page: number) {
            const limit = perPage || 50
            const head = (page - 1) * limit
            const [customers2] = await db.sequelize.query(`
            select email, full_name, key_expiration_date, deleted from customers2 c
            where 1 = 1
            and c.deleted <> 1
            and c.key_expiration_date < CURRENT_DATE() 
            order by key_expiration_date asc
            limit ${limit} offset ${head}`
            )

            let item = 1
            for (const customer of customers2) {
              params.Destination.ToAddresses = [customer.email]
              const sendPromise = new AWS.SES(SESConfig).sendEmail(params).promise()
              sendPromise.then(
                function(data) {
                  console.log(data.MessageId);
                  console.log('Email:', params.Destination.ToAddresses, '|', 'Volta:', item, '|', 'Pagina:', page, ' de:',  endPage)
                }).catch(
                  function(err) {
                    console.error(err, err.stack);
                    console.log('usuário atual:', item, '|', 'Pagina atual:', page,'|', 'total de páginas:',  endPage)
                  });
                item += 1
                
                await sleep(300)
            }
            await sleep(500)
            
            if (page < endPage) {
                page += 1
                await recursiveEmailSent(page)
            }
        }
        await recursiveEmailSent(startPage)
        console.log('FINALIZOU ENVIO')
    } catch (error) {
        console.log('entrou no catch', error)
    }
  }

export const find = async (request: CustomRequest, response: Response) => {
  const { startPage, perPage, token } = request.body

  if (token !== process.env.TOKEN) response.status(401).send()

    const [customers2] = await db.sequelize.query(`
            select email, full_name, key_expiration_date, deleted from customers2 c
            where 1 = 1
            and c.deleted <> 1
            and c.key_expiration_date < CURRENT_DATE() 
            order by key_expiration_date asc`
            )
        const total = customers2.length / 50
        const page = startPage || 1
    bulkEmail(page, total, perPage)
    response.status(200).send()
}