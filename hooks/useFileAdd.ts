import { Storage } from "@/app/api/user/storage/route";
import { file } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";

export function useAddFile() {
  const queryClient = useQueryClient();

  return (newFile: file) => {
    queryClient.setQueryData<Storage>(["storage"], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        files: [newFile, ...oldData.files],
      };
    });
  };
}
