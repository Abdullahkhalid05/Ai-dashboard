import {getServerSession} from 'next-auth'
import {authOptions} from '@/lib/auth'
import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'


export async function GET(req : Request) {
    
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
                { error: 'Session does not exists'},
                {status: 401}
            )
    }
    const user = session?.user.id
    const client = await prisma.client.findMany({
        where : {
            userId: user
        }
    })
    return NextResponse.json(client)
}

export async function POST(req: Request){
    const session = await getServerSession(authOptions)
    console.log('SESSION:', JSON.stringify(session))
    if (!session) {
        return NextResponse.json(
                { error: 'Session does not exists'},
                {status: 401}
            )
    }
    const {name , email , company} = await req.json()
    if (!name || !email || !company){
         return NextResponse.json(
                { error: 'Session does not exists'},
                {status: 500}
            )
    }
    const client = await prisma.client.create({
        data: {
            name : name,
            email : email ,
            company: company,
            userId: session?.user.id
        }
    })
    return NextResponse.json(
         client,
       {status: 201}
    )
}