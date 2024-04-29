import React from "react"
import DatePicker from "@/components/DatePicker"
import TimeSelector from "@/components/TimeSelector"
import { useRouter } from "next/navigation"
import { convertDateString, formatDateToString, formatDateToStringDash } from "@/utils/utils"
import { Record, SessionData, SetData } from "@/types/record"
import axiosInstance from "@/utils/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useToast from "@/hooks/useToast"
import UpdateSetData from "@/containers/records/update/UpdateSetData"

export default function UpdateSessionForm({ data }: { data: SessionData }) {
  const router = useRouter()
  const { addSuccessToast } = useToast()
  const queryClient = useQueryClient()
  const { mutate: sessionMutate } = useMutation({
    mutationFn: (body: any) => axiosInstance.put(`/sessions/${data.id}`, body),
  })

  const setOneData = (label: string, value: any) => {
    sessionMutate(
      { [label]: value },
      {
        onSuccess: () => queryClient.refetchQueries({ queryKey: [`/sessions/${data.id}`] }).then(),
      },
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <span className="w-20">날짜</span>
          <div className="flex items-center gap-2">
            <DatePicker setDate={(value) => setOneData("date", formatDateToStringDash(value))} />
            <span>{formatDateToString(convertDateString(data.date))}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="w-20">시작시간</span>
          <TimeSelector
            hour={data.startTime ? parseInt(data.startTime.split(":")[0], 10) : -1}
            minute={data.startTime ? parseInt(data.startTime.split(":")[1], 10) : -1}
            setHour={(value) => setOneData("startHour", value)}
            setMinute={(value) => setOneData("startMinute", value)}
          />
        </div>
        <div className="flex items-center">
          <span className="w-20">종료시간</span>
          <TimeSelector
            hour={data.endTime ? parseInt(data.endTime.split(":")[0], 10) : -1}
            minute={data.endTime ? parseInt(data.endTime.split(":")[1], 10) : -1}
            setHour={(value) => setOneData("endHour", value)}
            setMinute={(value) => setOneData("endMinute", value)}
          />
        </div>
      </div>
      {data.records.map((record: Record) => (
        <div key={record.id}>
          <hr />
          <h2 className="text-lg my-3">{record.sport.name}</h2>
          <div className="grid grid-cols-[minmax(0,_1fr)_45px_40px_minmax(0,_1fr)_45px_40px] gap-2 pt-2">
            {record.sets.map((set: SetData, idx: number) => (
              <UpdateSetData data={set} sessionId={data.id} idx={idx} key={set.id} />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          addSuccessToast("저장되었습니다.")
          router.back()
        }}
        className="w-full h-10 rounded-full bg-main-theme"
      >
        확인
      </button>
    </div>
  )
}