import { Storage } from "@/app/api/user/storage/route";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useFileStorage() {
  return useQuery({
    queryKey: ["storage"],
    queryFn: async () => {
      const res = await fetch("/api/user/storage");
      if (!res.ok)
        throw new Error(`Failed to fetch storage: ${res.statusText}`);

      const data: Storage = await res.json();

      return {
        ...data,
        files: data.files.map((file) => ({
          ...file,
          uploadDate: new Date(file.uploadDate),
        })),
      };
    },
  });
}

export function useUpdateStorageSize() {
  const queryClient = useQueryClient();

  return (sizeOfNewFile: number) => {
    queryClient.setQueryData<Storage>(["storage"], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        usedStorage: oldData.usedStorage + sizeOfNewFile,
      };
    });
  };
}
