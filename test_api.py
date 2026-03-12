import httpx
import asyncio

async def test_backend():
    print("Sending request to backend /api/quiz...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post("http://127.0.0.1:8000/api/quiz", json={
                "student_id": "test",
                "topic": "Machine Learning",
                "num_questions": 3,
                "difficulty": "beginner"
            }, timeout=60.0)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Connection Error: {e}")

asyncio.run(test_backend())
