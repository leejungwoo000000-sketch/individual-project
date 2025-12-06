export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface FileUpload {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface DownloadLog {
  id: string;
  fileId: string;
  fileName: string;
  userId: string;
  userName: string;
  downloadedAt: string;
}

export interface ChatLog {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
