import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import useAPI from '@/composables/useAPI'

const getApiBaseUrl = () =>
  String(import.meta.env.VITE_API_URL || 'http://localhost:8081').replace(/\/$/, '')

const createAuthorizer = () => {
  const { _post } = useAPI()

  return (channel) => ({
    authorize: (socketId, callback) => {
      _post(
        `${getApiBaseUrl()}/api/broadcasting/auth`,
        {
          socket_id: socketId,
          channel_name: channel.name,
        },
        { headers: { 'X-Requires-Auth': 'true' } },
      )
        .then((response) => callback(false, response))
        .catch((error) => callback(true, error))
    },
  })
}

export const createEchoClient = () => {
  window.Pusher = Pusher

  const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http'
  const host = import.meta.env.VITE_REVERB_HOST || window.location.hostname
  const port = Number(import.meta.env.VITE_REVERB_PORT || (scheme === 'https' ? 443 : 8081))

  return new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${getApiBaseUrl()}/api/broadcasting/auth`,
    authorizer: createAuthorizer(),
  })
}
