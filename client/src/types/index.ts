export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  picture: string | null;
  createdAt: string;
  fullName?: string;
  imageUrl?: string;

  image?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}


export interface Message {
  id: string;
  role: any;
  content: string;
  timestamp: string;
}

export interface Version {
  id: string;
  timestamp: string;
  code: string;
}

export interface Project {
  id: string;
  name: string;
  initial_prompt: string;
  current_code: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  isPublished?: boolean;
  versionId?: string;
  conversation: Message[];
  versions: Version[];
  current_version_index: string;
}
