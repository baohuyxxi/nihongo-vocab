export default function KanjiText({
  text,
}) {

  const length =
    text?.length || 1

  const fontSize =
    Math.max(
      36,
      Math.min(
        110,
        180 / Math.sqrt(length)
      )
    )

  return (

    <div
      className="
        w-full
        h-full

        flex
        items-center
        justify-center

        overflow-hidden
        text-center
      "
    >

      <div
        className="
          whitespace-pre-wrap
          break-words
        "
        style={{

          fontSize:
            `${fontSize}px`,

          lineHeight: 1.25,

          fontWeight: 300,

          fontFamily: `
            "Yu Mincho",
            "Hiragino Mincho ProN",
            "MS Mincho",
            serif
          `,
        }}
      >
        {text}
      </div>

    </div>

  )
}