import * as yup from 'yup'

import { isString } from 'lodash'

const updateComment = {
  authenticate: true,
  authorize: async (parent, { id }, { user, commentsService }) => {
    const count = await commentsService.count({ where: { id, author: user.id } })

    if (count <= 0) {
      throw new Error('You are not allowed to edit this comment.')
    }
  },
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.'),
    data: yup.object().shape({
      text: yup.string().trim().min(5, 'Text should at least be 5 characters.').max(500, 'Text should be 500 characters at most.')
    })
  }),
  resolve: async (parent, { id, data }, { user, commentsService, logger }) => {
    const comment = await commentsService.findOne({ where: { id, author: user.id } })

    logger.info('CommentMutation#updateComment.target %o', comment)

    if (isString(data.text)) {
      comment.text = data.text
    }

    const updatedComment = await commentsService.update(id, comment)

    return { comment: updatedComment }
  }
}

export default { updateComment }
