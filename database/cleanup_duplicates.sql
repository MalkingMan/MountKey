-- Script to clean up duplicate mountains
-- We will keep the entry with the MIN(id) and delete the others

DELETE FROM mountains 
WHERE id IN (
    SELECT id FROM (
        SELECT id FROM mountains 
        WHERE name = 'Annapurna I' 
        AND id > (SELECT MIN(id) FROM mountains WHERE name = 'Annapurna I')
    ) AS temp
);

DELETE FROM mountains 
WHERE id IN (
    SELECT id FROM (
        SELECT id FROM mountains 
        WHERE name = 'Nevado del Ruiz' 
        AND id > (SELECT MIN(id) FROM mountains WHERE name = 'Nevado del Ruiz')
    ) AS temp
);

DELETE FROM mountains 
WHERE id IN (
    SELECT id FROM (
        SELECT id FROM mountains 
        WHERE name = 'Pico da Neblina' 
        AND id > (SELECT MIN(id) FROM mountains WHERE name = 'Pico da Neblina')
    ) AS temp
);

SELECT 'Cleanup completed.' as status;
