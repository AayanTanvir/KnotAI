interface Knot {
    id: number
    name: string
}

interface Message {
    role: 'user' | 'assistant'
    content: string
}
