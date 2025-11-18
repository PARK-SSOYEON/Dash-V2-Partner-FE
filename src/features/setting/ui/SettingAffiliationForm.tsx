import * as React from "react"
import {useNavigate} from "react-router-dom";
import {MultiDropdownSelector} from "../../../shared/ui/dropdown/MultiDropdownSelector.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";

const sampleData = [
    {id: '1', label: '아주대학교'},
    {id: '2', label: '소프트웨어 융합학과'},
    {id: '3', label: '검색어에 해당하는 선택자 1'},
    {id: '4', label: '검색어에 해당하는 선택자 2'},
    {id: '6', label: '검색어에 해당하는 선택자 3'},
    {id: '7', label: '검색어에 해당하는 선택자 4'},
    {id: '5', label: '사이버보안학과'},
];

export function SettingAffiliationForm() {
    const navigate=useNavigate();
    const [affiliation, setAffiliation] = React.useState<string[]>([]);

    const handleSubmit=() =>{
        if(affiliation){
            //api
            navigate('/settings')
        } else (
            //기존 설정 유지할거임?
            navigate('/settings')
        )
    }

    return (
        <div className={"flex flex-col flex-1 bg-white p-8 gradient-border w-full rounded-4xl gap-6 "}>
            <div className={"font-medium text-2xl whitespace-pre-line leading-loose"}>
                다니시는 학교나 단체,<br/>모임을 모두 선택해주세요
            </div>

            <div className={"w-full flex flex-col gap-6"}>
                <MultiDropdownSelector
                    placeholder="소속단체 모두 선택"
                    searchPlaceholder="검색 키워드를 입력해주세요"
                    data={sampleData}
                    onSelect={(items) => setAffiliation(items.map(i => i.label))}
                />
            </div>

            <div
                className={"flex flex-row gap-3 fixed left-1/2 -translate-x-1/2 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md "}
                style={{
                    width: "min(calc(100vw - (var(--gutter,24px) * 2)), calc(var(--container-max,450px) - (var(--gutter,24px) * 2)))",
                    bottom: "max(1.5rem, env(safe-area-inset-bottom))",
                    height: "var(--bottom-nav-h,66px)",
                }}>
                <Button
                    mode="mono"
                    icon={"leftChevron"}
                    iconPosition='left'
                    onClick={()=>navigate('/settings')}
                >
                    변경 취소
                </Button>
                <Button
                    mode={"color_fill"}
                    icon={"rightChevron"}
                    iconPosition='right'
                    onClick={handleSubmit}
                >
                    저장
                </Button>
            </div>
        </div>
    )
}
