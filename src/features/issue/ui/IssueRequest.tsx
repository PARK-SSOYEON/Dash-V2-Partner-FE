import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";
import * as React from "react";

export function IssueRequest() {

    const basicItems: DetailItem[] = [
        {
            id: "title",
            label: "요청서 제목",
            value: "사이버보안학과 신입생 간식사업 조금 더 길게",
        },
        {
            id: "partner",
            label: "요청 파트너",
            value: "호시 타코야끼",
        },
        {
            id: "phone",
            label: "요청 연락처",
            value: "010-1234-1234",
        },
        {
            id: "date",
            label: "요청일시",
            value: "2025.11.07. 14:30:56"
        },
    ];

    const [menuItems, setMenuItems] = React.useState<IssueItem[]>([
        { id: "1", name: "오리지널 타코야끼", qty: 5 },
        { id: "2", name: "네기 타코야끼", qty: 100 },
        { id: "3", name: "눈꽃치즈 타코야끼", qty: 1000 }
    ]);


    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col w-full text-xl font-bold gap-4">
                기본 정보
                <DetailBox items={basicItems}/>
            </div>

            <div className="flex flex-col w-full text-xl font-bold gap-4">
                발행품목 및 수량
                <MenuInput
                    items={menuItems}
                    onChange={setMenuItems}
                />
            </div>
        </div>
    );
}
