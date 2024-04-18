import LogoutButton from "@/components/LogoutButton"
import UserName from "@/containers/more/UserName"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import UserMemo from "@/containers/more/UserMemo"

export default function More() {
  return (
    <main className="lg:w-[1000px] w-full align-middle px-3">
      <section className="p-6 w-full">
        <div className="h-16 bg-content-box rounded-md px-5 flex items-center justify-between">
          <div className="flex gap-3 items-end">
            <FontAwesomeIcon className="text-main-theme w-8 h-8" icon={faUser} />
            <UserName />
          </div>
          <LogoutButton />
        </div>
      </section>
      <hr className="border-text-gray" />
      <section className="py-6 px-11 w-full h-16 font-GmarketSansMedium text-base">
        <p>📝 메모</p>
        <UserMemo />
      </section>
    </main>
  )
}