import express from 'express';

const router = new express.Router();

router.get('/hello', async (req, res) => {
	res.json({
		message: 'Hello world',
	});
});

export default router;
