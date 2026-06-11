import TopicCard from "./TopicCard"

export default function TopicBoard({
  topics,
  vocabs,
  onPreview,
  onEditTopic,
  onDeleteTopic,
}) {

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        2xl:grid-cols-3
        gap-5
      "
    >

      {topics.map((topic) => {

        const topicVocabs
          = vocabs.filter(
            (item) =>
              item.topicId ===
              topic._id
          )

        return (

          <TopicCard
            key={topic._id}
            topic={topic}
            vocabs={topicVocabs}
            onPreview={() =>
              onPreview(topic)
            }
            onEdit={() =>
              onEditTopic(topic)
            }
            onDelete={() =>
              onDeleteTopic(
                topic._id
              )
            }
          />

        )

      })}

    </div>

  )

}