const REPLAY_MAGIC = 'TAGame.Replay_Soccar_TA'

const MIN_SIZE_BYTES = 5 * 1024          // 5 KB
const MAX_SIZE_BYTES = 30 * 1024 * 1024  // 30 MB

const BYTES_TO_INSPECT = 4096

/**
 * Valida um Attachment do discord.js para garantir (na medida do possível)
 * que se trata de um replay real do Rocket League antes de repassar para a staff.
 *
 * @param {import('discord.js').Attachment} attachment
 * @returns {Promise<{ valido: boolean, motivo?: string }>}
 */
async function validarReplay(attachment) {
    if (!attachment.name?.toLowerCase().endsWith('.replay')) {
        return { valido: false, motivo: 'O arquivo precisa ter a extensão **.replay**.' }
    }

    if (attachment.size < MIN_SIZE_BYTES) {
        return { valido: false, motivo: 'O arquivo é pequeno demais para ser um replay válido.' }
    }

    if (attachment.size > MAX_SIZE_BYTES) {
        return { valido: false, motivo: 'O arquivo é grande demais para ser um replay válido.' }
    }

    let buffer
    try {
        const res = await fetch(attachment.url)
        if (!res.ok) {
            return { valido: false, motivo: 'Não consegui baixar o arquivo para validar o conteúdo.' }
        }
        const arrayBuffer = await res.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
    } catch (err) {
        console.error('Erro ao baixar anexo para validação:', err)
        return { valido: false, motivo: 'Não consegui baixar o arquivo para validar o conteúdo.' }
    }

    const header = buffer.subarray(0, BYTES_TO_INSPECT).toString('latin1')

    if (!header.includes(REPLAY_MAGIC)) {
        return { valido: false, motivo: 'O conteúdo do arquivo não corresponde a um replay do Rocket League.' }
    }

    return { valido: true }
}

async function validaUrlVideo(url) {

    const DOMINIOS_PERMITIDOS = [
        'youtube.com',
        'youtu.be',
        'twitch.tv',
        'clips.twitch.tv',
    ]

    const MAX_REDIRECTS = 3

    let parsed
    try {
        parsed = new URL(url)
    } catch {
        return { valido: false, motivo: 'O link informado não é uma URL válida.' }
    }

    if (parsed.protocol !== 'https:') {
        return { valido: false, motivo: 'O link precisa começar com https://.' }
    }

    if (parsed.username || parsed.password) {
        return { valido: false, motivo: 'O link contém dados suspeitos e foi bloqueado.' }
    }

    const hostname = parsed.hostname.toLowerCase()

    const ehIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':')
    if (ehIP) {
        return { valido: false, motivo: 'Não é permitido usar endereço IP direto como link.' }
    }

    const dominioValido = (host) =>
        DOMINIOS_PERMITIDOS.some(dominio => host === dominio || host.endsWith(`.${dominio}`))

    if (!dominioValido(hostname)) {
        return { valido: false, motivo: 'Só são aceitos links do YouTube ou Twitch.' }
    }

    let urlAtual = parsed.toString()
    for (let i = 0; i < MAX_REDIRECTS; i++) {
        let resposta
        try {
            resposta = await fetch(urlAtual, { method: 'HEAD', redirect: 'manual' })
        } catch (err) {
            return { valido: false, motivo: 'Não foi possível acessar o link informado.' }
        }

        if (resposta.status >= 300 && resposta.status < 400 && resposta.headers.get('location')) {
            const proximaUrl = new URL(resposta.headers.get('location'), urlAtual)

            if (proximaUrl.protocol !== 'https:' || !dominioValido(proximaUrl.hostname.toLowerCase())) {
                return { valido: false, motivo: 'O link redireciona para um domínio não permitido.' }
            }

            urlAtual = proximaUrl.toString()
            continue
        }

        break
    }

    return { valido: true }
}
module.exports = { validarReplay, validaUrlVideo }
