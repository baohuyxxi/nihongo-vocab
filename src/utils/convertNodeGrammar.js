// verbForm: {
//             type: String,
//             enum: [
//                 "dictionary",

//                 "masu",

//                 "te",

//                 "ta",

//                 "nai",

//                 "potential",

//                 "volitional",

//                 "imperative",

//                 "prohibitive",

//                 "ba",

//                 "tara",

//                 "passive",

//                 "causative",

//                 "causative_passive",
//             ],
//         },
export const verbForm = (verbForm) => {
    const map = {
        dictionary: "Động từ nguyên thể",
        masu: "Động từ ます",
        te: "Động từ て",
        ta: "Động từ た",    
        nai: "Động từ phủ định",
        potential: "Động từ khả năng",
        volitional: "Động từ ý chí",
        imperative: "Động từ mệnh lệnh",
        prohibitive: "Động từ cấm đoán",
        ba: "Động từ điều kiện ば",
        tara: "Động từ điều kiện たら",
        passive: "Động từ bị động",
        causative: "Động từ sai khiến",
        causative_passive: "Động từ sai khiến bị động",
    }

    return map[verbForm] || verbForm
}


    //  type: {
    //         type: String,
    //         enum: [
    //             "custom",
    //             "noun",
    //             "adj_i",
    //             "adj_na",
    //             "verb",
    //             "keyword",
    //         ],
    //         required: true,
    //     },   

export const typeForm = (typeForm) => {
    const map = {
        custom: "Tùy chỉnh",
        noun: "Danh từ",
        adj_i: "Tính từ い",
        adj_na: "Tính từ な",
        verb: "Động từ",
        keyword: "Từ khóa",
    }

    return map[typeForm] || typeForm
}



