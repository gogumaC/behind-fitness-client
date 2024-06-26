import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/utils/axiosInstance"

export default function useUserInfoQuery() {
  const queryClient = useQueryClient()
  const { data, isFetched } = useQuery({
    queryKey: ["/users/mine"],
    queryFn: async () => {
      return axiosInstance.get("/users/mine").then((res) => res.data.response)
    },
    staleTime: 300_000,
  })

  const { mutate: updateMutation } = useMutation({
    mutationFn: (newInfo: any) => {
      return axiosInstance.put("/users/mine", newInfo)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/users/mine"] }).then()
    },
  })

  return { userInfo: data, isFetched, updateUserInfo: updateMutation }
}
