import {Icon} from "../../../shared/ui/Icon.tsx";
import {IssueRequest} from "./IssueRequest.tsx";
import {SlideSelector} from "../../../shared/ui/SlideSelector.tsx";
import {useState} from "react";
import {CouponHistory} from "./CouponHistory.tsx";
import {useNavigate} from "react-router-dom";

export function IssueDetail() {
    const [tap, setTap] = useState('발행요청서');
    const navigate = useNavigate();

    return (
        <div className="flex flex-col pt-4 w-full gap-6 min-h-[calc(100vh-var(--bottom-nav-h,66px)-40px)]">
            <header className="flex flex-col justify-between h-17">
                <button className={"flex flex-row gap-2 font-light text-base items-center justify-start"}
                onClick={()=>navigate('/issue')}
                >
                    <Icon name={"leftChevron"} size={24}/> 발행목록
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-black">
                    발행내역 상세
                </h1>
            </header>

            <SlideSelector
                options={['발행요청서', '쿠폰내역', '주요통계']}
                value={tap}
                onChange={setTap}
                disabledOptions={['주요통계']}
            />

            {tap === "발행요청서" && (<IssueRequest/>)}
            {tap==="쿠폰내역" && (<CouponHistory/>)}
        </div>
    );
}
