declare module '@stacks/connect' {
  export class AppConfig {
    constructor(scopes: string[])
  }
  
  export class UserSession {
    constructor(options: { appConfig: AppConfig })
    isSignInPending(): boolean
    handlePendingSignIn(): Promise<void>
    isUserSignedIn(): boolean
    signUserOut(redirectTo: string): void
  }
  
  export function showConnect(options: {
    appDetails: {
      name: string
      icon: string
    }
    redirectTo: string
    onFinish: () => void
    userSession: UserSession
  }): void
} 