import { createReadStream } from 'fs'
import * as path from 'path'
import Fastify, { FastifyRequest } from 'fastify'
import fastifyStatic from '@fastify/static'

const fastify = Fastify()

export function setup() {
    fastify.register(fastifyStatic, {
        root: path.join(__dirname, 'data'),
        prefix: '/',
        index: false,
        list: true,
    })

    fastify.get('/headers', (request, reply) => {
        reply.send(request.headers)
    })

    type NdjsonRequest = FastifyRequest<{
        Params: {
            site: string
            file: string
        }
    }>

    fastify.get('/ndjson/:site/:file', (request: NdjsonRequest, reply) => {
        if (request.headers.accept !== 'application/x-ndjson') {
            reply.status(400).send({
                error: 'Missing header: `Accept: application/x-ndjson`',
            })
            return
        }

        const { site, file } = request.params

        reply.type('application/x-ndjson').send(createReadStream(__dirname + `/data/${site}/${file}.ndjson`))
    })

    type StatusCodeRequest = FastifyRequest<{
        Params: {
            code: number
        }
    }>

    fastify.get('/status/:code', (request: StatusCodeRequest, reply) => {
        reply.status(request.params.code).send({
            error: 'Error',
            code: request.params.code,
        })
    })

    fastify.listen({ port: 0 }, (err, address) => {
        if (err) throw err

        process.env.MockServerAddress = address
        console.log('Mock API server started at:', address)
    })
}

export function teardown() {
    fastify.close()
}
