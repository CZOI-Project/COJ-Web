import type { RecordDetailDTO, RecordQuery, RecordSummaryDTO } from "@/entify/record";
import request from '@/api';
import { toGetParams } from "@/utils";

export const recordDetail = async (rid: number): Promise<RecordDetailDTO> => {
    const res: RecordDetailDTO = await request.get("/record/detail", toGetParams({rid: rid}));
    return res;
}

export const recordSearch = async (data: RecordQuery): Promise<[number, RecordSummaryDTO[]]> => {
    interface Response {
        count: number,
        records: RecordSummaryDTO[]
    }
    const res: Response = await request.get("/record/list", toGetParams(data));
    return [res.count, res.records];
}

