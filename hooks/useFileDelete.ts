import { deleteFile } from "@/actions/file";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storage"] });
    },
  });
}
