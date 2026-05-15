export default async function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>{process.env.NEXT_PUBLIC_APP_NAME}</h1>
    </div>
  )
}
