export const createAuthTokenStore = () => {
  let token = null

  return {
    get: () => token,
    set: value => { token = value || null },
    clear: () => { token = null },
    hasPersistedToken: () => false,
  }
}

export const authTokenStore = createAuthTokenStore()
