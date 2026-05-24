import TopicsService, { TopicRow, TopicStatus } from './topics.service'

export async function createTopicAction(payload: { subjectId: string; title: string; status?: TopicStatus; estimatedHours?: number }) {
  try {
    const topic = await TopicsService.create({
      subjectId: payload.subjectId,
      title: payload.title,
      status: payload.status,
      estimatedHours: payload.estimatedHours,
    })
    return { success: true, topic }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function listTopicsBySubjectAction(subjectId: string) {
  try {
    const topics = await TopicsService.listBySubject(subjectId)
    return { success: true, topics }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function getTopicAction(id: string) {
  try {
    const topic = await TopicsService.getById(id)
    return { success: true, topic }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function updateTopicAction(id: string, payload: { title?: string; status?: TopicStatus; estimatedHours?: number | null }) {
  try {
    const topic = await TopicsService.update(id, { title: payload.title, status: payload.status, estimatedHours: payload.estimatedHours })
    return { success: true, topic }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function deleteTopicAction(id: string) {
  try {
    const topic = await TopicsService.delete(id)
    return { success: true, topic }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

