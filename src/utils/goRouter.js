// router.js
import { useRouter } from 'vue-router';

export const useGoRouter = () => {
  const router = useRouter();
  const goRouter = (path) => {
    router.push(path);
  };
  return { goRouter };
};