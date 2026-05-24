import SubjectsService from './subjects.service'

export async function createSubjectAction(payload: { title: string; description?: string; ownerId?: string }) {
  try {
    const subject = await SubjectsService.create(payload)
    return { success: true, subject }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function listSubjectsAction(ownerId?: string) {
  try {
    const subjects = await SubjectsService.list(ownerId)
    return { success: true, subjects }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function getSubjectAction(id: string) {
  try {
    const subject = await SubjectsService.getById(id)
    return { success: true, subject }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function updateSubjectAction(id: string, payload: { title?: string; description?: string | null }) {
  try {
    const subject = await SubjectsService.update(id, payload)
    return { success: true, subject }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function deleteSubjectAction(id: string) {
  try {
    const subject = await SubjectsService.delete(id)
    return { success: true, subject }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

