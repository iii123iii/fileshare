import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateStorage() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["storage"],
    });
  };
}
