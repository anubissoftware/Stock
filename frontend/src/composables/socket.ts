import type { Socket } from "socket.io-client";
import { reactive, type UnwrapNestedRefs } from "vue";

const socket: UnwrapNestedRefs<{socket: Socket | null}> = reactive({
    socket: null
})


export default  socket

