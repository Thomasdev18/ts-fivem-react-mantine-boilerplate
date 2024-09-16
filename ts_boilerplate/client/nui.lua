function ShowNUI(action, shouldShow)
    SetNuiFocus(shouldShow, shouldShow)
    SendNUIMessage({ action = action, data = shouldShow })
end
  
function SendNUI(action, data)
    SendNUIMessage({ action = action, data = data })
end

RegisterNuiCallback('hideFrame', function(data, cb)
    ShowNUI(data.name, false)
    cb(true)
end)