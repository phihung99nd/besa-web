import {minioAPI} from "@/config";

export default {
  methods: {
    parseMinioURL(url){
      return url ? `${process.env.VUE_APP_MINIO_API || minioAPI}${new URL(url).pathname}${new URL(url).search}` : ''
    }
  }
}
