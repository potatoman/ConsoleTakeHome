interface Apps {
    id: string
    name: string
    url?: string | null
    logo?: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  
  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string | null
    title?: string | null
    department?: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  
  interface Group {
    id: string
    name?: string | null
    description?: string | null
    note?: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }

  interface Policy {
    name: string,
    description: string,
    visibility: string[],
    app: string,
    accessLength: string,
    reviewers: string[],
    provisioningSteps: string,
    accessibility: string[],
  }

  export type { Apps, User, Group, Policy }
