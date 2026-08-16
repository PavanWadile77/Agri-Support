export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'farmer' | 'expert' | 'admin';
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
  title: string;
  content: string;
  category: 'crops' | 'livestock' | 'machinery' | 'market' | 'general';
  createdAt: any;
  likes: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface MarketData {
  name: string;
  price: number;
  date: string;
}
