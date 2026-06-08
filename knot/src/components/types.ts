interface Knot {
    id: number
    name: string
}

interface Message {
    senderId: number
    senderName: string
    role: 'user' | 'assistant'
    content: string
}
