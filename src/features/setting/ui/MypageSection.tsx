import {useNavigate} from "react-router-dom";
import {Icon} from "../../../shared/ui/Icon.tsx";

export function MypageSection() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "회원정보 수정",
            items: [
                {label: "전화번호 변경", enabled: true, link: './phone'},
                {label: "소속 수정", enabled: true, link: './affiliation'},
            ],
        },
        {
            title: "서비스 이용",
            items: [
                {label: "공지사항", enabled: false, link: undefined},
                {label: "FAQ", enabled: false, link: undefined},
                {label: "문의하기", enabled: false, link: undefined},
            ],
        },
        {
            title: "계정 관리",
            items: [
                {label: "계정 전환", enabled: false, link: undefined},
            ],
        },
    ];

    return (
        <div className="mt-4 space-y-8">
            {sections.map((section) => (
                <section key={section.title}>
                    <h2 className="text-base font-medium text-black/30">
                        {section.title}
                    </h2>
                    <div className="mt-3 space-y-1">
                        {section.items.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                className={`flex w-full items-center justify-between py-3 ${!item.enabled ? "opacity-40 cursor-not-allowed" : ""}`}
                                onClick={item.enabled && item.link ? () => navigate(item.link) : undefined}
                            >
                                    <span className="text-base font-medium text-black px-2 ">
                                            {item.label}
                                        </span>
                                <Icon name={"rightChevron"} size={24}/>
                            </button>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
