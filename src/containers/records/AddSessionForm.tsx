"use client"

import axiosInstance from "@/utils/axiosInstance"
import React, { useState } from "react"
import useToast from "@/hooks/useToast"
import DatePicker from "@/components/DatePicker"
import { formatDateToString, formatDateToStringDash } from "@/utils/utils"
import TimeSelector from "@/components/TimeSelector"
import useMutateWithQueryClient from "@/hooks/useMutateWithQueryClient"
import { useRouter } from "next/navigation"
import useModal from "@/hooks/useModal"
import useErrorResponseHandler from "@/hooks/useErrorResponseHandler"
import moment from "moment"

export default function AddSessionForm({ defaultDate }: { defaultDate: Date }) {
  const router = useRouter()
  const { onCloseModal } = useModal()
  const { addSuccessToast } = useToast()
  const errorHandler = useErrorResponseHandler()
  const { mutate, queryClient } = useMutateWithQueryClient((data) => axiosInstance.post("/sessions", data))

  const [date, setDate] = useState(defaultDate)

  const now = moment()
  now.minute(Math.round(now.minute() / 10) * 10)
  const [startHour, setStartHour] = useState(now.hour())
  const [startMinute, setStartMinute] = useState(now.minute())

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => {
        e.preventDefault()
        const data = {
          date: formatDateToStringDash(date),
          startTime:
            startHour !== -1 && startMinute !== -1
              ? `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`
              : undefined,
        }
        mutate(data, {
          onSuccess: (res) => {
            onCloseModal(`/update-record?id=${res.data.response.id}`)
            addSuccessToast("기록이 생성되었습니다.")
            router.push(`/update-record?id=${res.data.response.id}`, { scroll: false })
            queryClient.invalidateQueries({ queryKey: ["/sessions"] }).then()
          },
          onError: (err) => errorHandler(err),
        })
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <span className="w-20">날짜</span>
          <div className="flex items-center gap-2">
            <DatePicker date={date} setDate={setDate} />
            <span>{formatDateToString(date)}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="w-20">시작시간</span>
          <TimeSelector hour={startHour} minute={startMinute} setHour={setStartHour} setMinute={setStartMinute} />
        </div>
      </div>
      <button type="submit" className="w-full h-10 rounded-full bg-main-theme">
        추가
      </button>
    </form>
  )
}
