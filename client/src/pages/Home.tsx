import { useState, useRef, MutableRefObject } from "react"
import { getBalance, TransactionTest, airdrop, createWallet } from "../../../wallet"
import { Card } from "../components/card"
export const Home = () => {
    const [state, setState] = useState<string>("")
    const airdropRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const amountRef : MutableRefObject<HTMLInputElement | null> = useRef(null);
    const toRef :MutableRefObject<HTMLInputElement | null> = useRef(null);

    return (
        <div className="bg-gradient-to-tr from-black to-purple-500 h-screen w-screen text-white flex flex-col items-center justify-center">
            <div className="flex flex-row gap-2">
            <button onClick={()=>createWallet()} className="px-4 py-2 bg-black bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-20">Create Wallet</button>
                <button onClick={()=>setState("airdrop")} className="px-4 py-2 bg-black bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-20">Airdrop</button>
                <button onClick={()=>
                    {getBalance().then((balance)=>{
                        alert(`Your balance is: ${balance}`)
                    })}
                } className="px-4 py-2 bg-black bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-20">GetBalance</button>
                <button onClick={()=>setState("transaction")} className="px-4 py-2 bg-black bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-20">Transaction</button>
            </div>
            {state === "airdrop" && 
                <Card>
                        
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        airdrop(+airdropRef.current!.value).then(()=>{
                            airdropRef.current!.value = ""
                        })}}
                        className="flex flex-col gap-10 p-5">
                            <input ref={airdropRef} name="amount" type="text" placeholder="Amount" className="px-4 py-2 bg-black bg-opacity-20 rounded-xl"/>
                            <button type="submit" className="mt-auto px-4 py-2 bg-black bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-20">Airdrop</button>
                        </form>

                </Card>
            }
            {state === "transaction" &&
                <Card>
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        TransactionTest(toRef.current!.value,+amountRef.current!.value).then(()=>{
                            toRef.current!.value = ""
                        })
                    }
                        } className="flex flex-col gap-2 p-5">
                        <input ref={toRef} type="text" placeholder="To" className="px-4 py-2 bg-black bg-opacity-20 rounded-xl"/>
                        <input ref={amountRef} type="text" placeholder="Amount" className="px-4 py-2 bg-black bg-opacity-20 rounded-xl"/>
                        <button type="submit" className="mt-auto px-4 py-2 bg-black bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-20">Send</button>
                    </form>
                </Card>
            }
        </div>
    )
}