import dataService from './dataService';

describe('fetchAndTransformData', () => {
  it('ควรแปลงข้อมูลและจัดกลุ่มตาม department ได้อย่างถูกต้อง', async () => {
    const data = await dataService();
    
    console.log("ข้อมูลที่ได้จาก dataService:", data);
    
    expect(data).toBeDefined();
    expect(data['Services']).toBeDefined(); // เปลี่ยนเป็น department ที่คุณแน่ใจว่ามีข้อมูล
    expect(data['Services'].male).toBeGreaterThanOrEqual(0);
    expect(data['Services'].female).toBeGreaterThanOrEqual(0);
  });
});
